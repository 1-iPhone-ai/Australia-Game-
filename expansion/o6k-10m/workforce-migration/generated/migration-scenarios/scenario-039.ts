import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 039 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_039_META = {
  id: 'mig_039',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 38678,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_039_COEF = {
  k0: 96.9000,
  k1: 76.4000,
  k2: 55.9000,
  k3: 35.4000,
  k4: 14.9000,
  k5: 94.1000,
  k6: 73.6000,
  k7: 53.1000,
  k8: 32.6000,
  k9: 12.1000,
  k10: 91.3000,
  k11: 70.8000,
  k12: 50.3000,
  k13: 29.8000,
  k14: 9.3000,
  k15: 88.5000,
  k16: 68.0000,
  k17: 47.5000,
  k18: 27.0000,
  k19: 6.5000,
  k20: 85.7000,
  k21: 65.2000,
  k22: 44.7000,
  k23: 24.2000,
  k24: 3.7000,
  k25: 82.9000,
  k26: 62.4000,
  k27: 41.9000,
  k28: 21.4000,
  k29: 0.9000,
  k30: 80.1000,
  k31: 59.6000,
  k32: 39.1000,
  k33: 18.6000,
  k34: 97.8000,
  k35: 77.3000,
  k36: 56.8000,
  k37: 36.3000,
  k38: 15.8000,
  k39: 95.0000,
  k40: 74.5000,
  k41: 54.0000,
  k42: 33.5000,
  k43: 13.0000,
  k44: 92.2000,
  k45: 71.7000,
  k46: 51.2000,
  k47: 30.7000,
  k48: 10.2000,
  k49: 89.4000,
  k50: 68.9000,
  k51: 48.4000,
  k52: 27.9000,
  k53: 7.4000,
  k54: 86.6000,
  k55: 66.1000,
  k56: 45.6000,
  k57: 25.1000,
  k58: 4.6000,
  k59: 83.8000,
  k60: 63.3000,
  k61: 42.8000,
  k62: 22.3000,
  k63: 1.8000,
  k64: 81.0000,
  k65: 60.5000,
  k66: 40.0000,
  k67: 19.5000,
  k68: 98.7000,
  k69: 78.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_039_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_039_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_039_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_039_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_039_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_039_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_039_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_039_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_039_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_039_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_039_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
