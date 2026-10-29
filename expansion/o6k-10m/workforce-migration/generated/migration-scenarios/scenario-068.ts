import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 068 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_068_META = {
  id: 'mig_068',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 67417,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_068_COEF = {
  k0: 9.9000,
  k1: 71.7000,
  k2: 33.8000,
  k3: 95.6000,
  k4: 57.7000,
  k5: 19.8000,
  k6: 81.6000,
  k7: 43.7000,
  k8: 5.8000,
  k9: 67.6000,
  k10: 29.7000,
  k11: 91.5000,
  k12: 53.6000,
  k13: 15.7000,
  k14: 77.5000,
  k15: 39.6000,
  k16: 1.7000,
  k17: 63.5000,
  k18: 25.6000,
  k19: 87.4000,
  k20: 49.5000,
  k21: 11.6000,
  k22: 73.4000,
  k23: 35.5000,
  k24: 97.3000,
  k25: 59.4000,
  k26: 21.5000,
  k27: 83.3000,
  k28: 45.4000,
  k29: 7.5000,
  k30: 69.3000,
  k31: 31.4000,
  k32: 93.2000,
  k33: 55.3000,
  k34: 17.4000,
  k35: 79.2000,
  k36: 41.3000,
  k37: 3.4000,
  k38: 65.2000,
  k39: 27.3000,
  k40: 89.1000,
  k41: 51.2000,
  k42: 13.3000,
  k43: 75.1000,
  k44: 37.2000,
  k45: 99.0000,
  k46: 61.1000,
  k47: 23.2000,
  k48: 85.0000,
  k49: 47.1000,
  k50: 9.2000,
  k51: 71.0000,
  k52: 33.1000,
  k53: 94.9000,
  k54: 57.0000,
  k55: 19.1000,
  k56: 80.9000,
  k57: 43.0000,
  k58: 5.1000,
  k59: 66.9000,
  k60: 29.0000,
  k61: 90.8000,
  k62: 52.9000,
  k63: 15.0000,
  k64: 76.8000,
  k65: 38.9000,
  k66: 1.0000,
  k67: 62.8000,
  k68: 24.9000,
  k69: 86.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_068_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_068_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_068_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_068_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_068_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_068_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_068_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_068_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_068_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_068_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_068_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
