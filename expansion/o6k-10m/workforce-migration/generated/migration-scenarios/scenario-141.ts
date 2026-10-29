import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 141 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_141_META = {
  id: 'mig_141',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 139760,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_141_COEF = {
  k0: 90.0000,
  k1: 8.3000,
  k2: 26.3000,
  k3: 44.3000,
  k4: 62.3000,
  k5: 80.3000,
  k6: 98.3000,
  k7: 16.6000,
  k8: 34.6000,
  k9: 52.6000,
  k10: 70.6000,
  k11: 88.6000,
  k12: 6.9000,
  k13: 24.9000,
  k14: 42.9000,
  k15: 60.9000,
  k16: 78.9000,
  k17: 96.9000,
  k18: 15.2000,
  k19: 33.2000,
  k20: 51.2000,
  k21: 69.2000,
  k22: 87.2000,
  k23: 5.5000,
  k24: 23.5000,
  k25: 41.5000,
  k26: 59.5000,
  k27: 77.5000,
  k28: 95.5000,
  k29: 13.8000,
  k30: 31.8000,
  k31: 49.8000,
  k32: 67.8000,
  k33: 85.8000,
  k34: 4.1000,
  k35: 22.1000,
  k36: 40.1000,
  k37: 58.1000,
  k38: 76.1000,
  k39: 94.1000,
  k40: 12.4000,
  k41: 30.4000,
  k42: 48.4000,
  k43: 66.4000,
  k44: 84.4000,
  k45: 2.7000,
  k46: 20.7000,
  k47: 38.7000,
  k48: 56.7000,
  k49: 74.7000,
  k50: 92.7000,
  k51: 11.0000,
  k52: 29.0000,
  k53: 47.0000,
  k54: 65.0000,
  k55: 83.0000,
  k56: 1.3000,
  k57: 19.3000,
  k58: 37.3000,
  k59: 55.3000,
  k60: 73.3000,
  k61: 91.3000,
  k62: 9.6000,
  k63: 27.6000,
  k64: 45.6000,
  k65: 63.6000,
  k66: 81.6000,
  k67: 99.6000,
  k68: 17.9000,
  k69: 35.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_141_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_141_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_141_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_141_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_141_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_141_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_141_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_141_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_141_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_141_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_141_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
