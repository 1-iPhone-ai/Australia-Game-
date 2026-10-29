import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 079 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_079_META = {
  id: 'mig_079',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 78318,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_079_COEF = {
  k0: 76.6000,
  k1: 32.1000,
  k2: 87.3000,
  k3: 42.8000,
  k4: 98.0000,
  k5: 53.5000,
  k6: 9.0000,
  k7: 64.2000,
  k8: 19.7000,
  k9: 74.9000,
  k10: 30.4000,
  k11: 85.6000,
  k12: 41.1000,
  k13: 96.3000,
  k14: 51.8000,
  k15: 7.3000,
  k16: 62.5000,
  k17: 18.0000,
  k18: 73.2000,
  k19: 28.7000,
  k20: 83.9000,
  k21: 39.4000,
  k22: 94.6000,
  k23: 50.1000,
  k24: 5.6000,
  k25: 60.8000,
  k26: 16.3000,
  k27: 71.5000,
  k28: 27.0000,
  k29: 82.2000,
  k30: 37.7000,
  k31: 92.9000,
  k32: 48.4000,
  k33: 3.9000,
  k34: 59.1000,
  k35: 14.6000,
  k36: 69.8000,
  k37: 25.3000,
  k38: 80.5000,
  k39: 36.0000,
  k40: 91.2000,
  k41: 46.7000,
  k42: 2.2000,
  k43: 57.4000,
  k44: 12.9000,
  k45: 68.1000,
  k46: 23.6000,
  k47: 78.8000,
  k48: 34.3000,
  k49: 89.5000,
  k50: 45.0000,
  k51: 0.5000,
  k52: 55.7000,
  k53: 11.2000,
  k54: 66.4000,
  k55: 21.9000,
  k56: 77.1000,
  k57: 32.6000,
  k58: 87.8000,
  k59: 43.3000,
  k60: 98.5000,
  k61: 54.0000,
  k62: 9.5000,
  k63: 64.7000,
  k64: 20.2000,
  k65: 75.4000,
  k66: 30.9000,
  k67: 86.1000,
  k68: 41.6000,
  k69: 96.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_079_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_079_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_079_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_079_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_079_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_079_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_079_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_079_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_079_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_079_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_079_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
