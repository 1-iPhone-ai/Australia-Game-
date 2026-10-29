import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 108 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_108_META = {
  id: 'mig_108',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 107057,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_108_COEF = {
  k0: 89.3000,
  k1: 27.4000,
  k2: 65.2000,
  k3: 3.3000,
  k4: 41.1000,
  k5: 78.9000,
  k6: 17.0000,
  k7: 54.8000,
  k8: 92.6000,
  k9: 30.7000,
  k10: 68.5000,
  k11: 6.6000,
  k12: 44.4000,
  k13: 82.2000,
  k14: 20.3000,
  k15: 58.1000,
  k16: 95.9000,
  k17: 34.0000,
  k18: 71.8000,
  k19: 9.9000,
  k20: 47.7000,
  k21: 85.5000,
  k22: 23.6000,
  k23: 61.4000,
  k24: 99.2000,
  k25: 37.3000,
  k26: 75.1000,
  k27: 13.2000,
  k28: 51.0000,
  k29: 88.8000,
  k30: 26.9000,
  k31: 64.7000,
  k32: 2.8000,
  k33: 40.6000,
  k34: 78.4000,
  k35: 16.5000,
  k36: 54.3000,
  k37: 92.1000,
  k38: 30.2000,
  k39: 68.0000,
  k40: 6.1000,
  k41: 43.9000,
  k42: 81.7000,
  k43: 19.8000,
  k44: 57.6000,
  k45: 95.4000,
  k46: 33.5000,
  k47: 71.3000,
  k48: 9.4000,
  k49: 47.2000,
  k50: 85.0000,
  k51: 23.1000,
  k52: 60.9000,
  k53: 98.7000,
  k54: 36.8000,
  k55: 74.6000,
  k56: 12.7000,
  k57: 50.5000,
  k58: 88.3000,
  k59: 26.4000,
  k60: 64.2000,
  k61: 2.3000,
  k62: 40.1000,
  k63: 77.9000,
  k64: 16.0000,
  k65: 53.8000,
  k66: 91.6000,
  k67: 29.7000,
  k68: 67.5000,
  k69: 5.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_108_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_108_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_108_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_108_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_108_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_108_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_108_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_108_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_108_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_108_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_108_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
