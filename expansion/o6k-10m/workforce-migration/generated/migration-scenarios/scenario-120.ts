import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 120 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_120_META = {
  id: 'mig_120',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 118949,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_120_COEF = {
  k0: 53.3000,
  k1: 83.9000,
  k2: 14.8000,
  k3: 45.4000,
  k4: 76.0000,
  k5: 6.9000,
  k6: 37.5000,
  k7: 68.1000,
  k8: 98.7000,
  k9: 29.6000,
  k10: 60.2000,
  k11: 90.8000,
  k12: 21.7000,
  k13: 52.3000,
  k14: 82.9000,
  k15: 13.8000,
  k16: 44.4000,
  k17: 75.0000,
  k18: 5.9000,
  k19: 36.5000,
  k20: 67.1000,
  k21: 97.7000,
  k22: 28.6000,
  k23: 59.2000,
  k24: 89.8000,
  k25: 20.7000,
  k26: 51.3000,
  k27: 81.9000,
  k28: 12.8000,
  k29: 43.4000,
  k30: 74.0000,
  k31: 4.9000,
  k32: 35.5000,
  k33: 66.1000,
  k34: 96.7000,
  k35: 27.6000,
  k36: 58.2000,
  k37: 88.8000,
  k38: 19.7000,
  k39: 50.3000,
  k40: 80.9000,
  k41: 11.8000,
  k42: 42.4000,
  k43: 73.0000,
  k44: 3.9000,
  k45: 34.5000,
  k46: 65.1000,
  k47: 95.7000,
  k48: 26.6000,
  k49: 57.2000,
  k50: 87.8000,
  k51: 18.7000,
  k52: 49.3000,
  k53: 79.9000,
  k54: 10.8000,
  k55: 41.4000,
  k56: 72.0000,
  k57: 2.9000,
  k58: 33.5000,
  k59: 64.1000,
  k60: 94.7000,
  k61: 25.6000,
  k62: 56.2000,
  k63: 86.8000,
  k64: 17.7000,
  k65: 48.3000,
  k66: 78.9000,
  k67: 9.8000,
  k68: 40.4000,
  k69: 71.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_120_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_120_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_120_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_120_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_120_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_120_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_120_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_120_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_120_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_120_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_120_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
