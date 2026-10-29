import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 028 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_028_META = {
  id: 'mig_028',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 27777,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_028_COEF = {
  k0: 30.2000,
  k1: 16.3000,
  k2: 2.4000,
  k3: 88.2000,
  k4: 74.3000,
  k5: 60.4000,
  k6: 46.5000,
  k7: 32.6000,
  k8: 18.7000,
  k9: 4.8000,
  k10: 90.6000,
  k11: 76.7000,
  k12: 62.8000,
  k13: 48.9000,
  k14: 35.0000,
  k15: 21.1000,
  k16: 7.2000,
  k17: 93.0000,
  k18: 79.1000,
  k19: 65.2000,
  k20: 51.3000,
  k21: 37.4000,
  k22: 23.5000,
  k23: 9.6000,
  k24: 95.4000,
  k25: 81.5000,
  k26: 67.6000,
  k27: 53.7000,
  k28: 39.8000,
  k29: 25.9000,
  k30: 12.0000,
  k31: 97.8000,
  k32: 83.9000,
  k33: 70.0000,
  k34: 56.1000,
  k35: 42.2000,
  k36: 28.3000,
  k37: 14.4000,
  k38: 0.5000,
  k39: 86.3000,
  k40: 72.4000,
  k41: 58.5000,
  k42: 44.6000,
  k43: 30.7000,
  k44: 16.8000,
  k45: 2.9000,
  k46: 88.7000,
  k47: 74.8000,
  k48: 60.9000,
  k49: 47.0000,
  k50: 33.1000,
  k51: 19.2000,
  k52: 5.3000,
  k53: 91.1000,
  k54: 77.2000,
  k55: 63.3000,
  k56: 49.4000,
  k57: 35.5000,
  k58: 21.6000,
  k59: 7.7000,
  k60: 93.5000,
  k61: 79.6000,
  k62: 65.7000,
  k63: 51.8000,
  k64: 37.9000,
  k65: 24.0000,
  k66: 10.1000,
  k67: 95.9000,
  k68: 82.0000,
  k69: 68.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_028_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_028_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_028_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_028_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_028_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_028_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_028_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_028_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_028_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_028_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_028_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
