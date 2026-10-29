import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 115 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_115_META = {
  id: 'mig_115',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 113994,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_115_COEF = {
  k0: 68.3000,
  k1: 2.2000,
  k2: 35.8000,
  k3: 69.4000,
  k4: 3.3000,
  k5: 36.9000,
  k6: 70.5000,
  k7: 4.4000,
  k8: 38.0000,
  k9: 71.6000,
  k10: 5.5000,
  k11: 39.1000,
  k12: 72.7000,
  k13: 6.6000,
  k14: 40.2000,
  k15: 73.8000,
  k16: 7.7000,
  k17: 41.3000,
  k18: 74.9000,
  k19: 8.8000,
  k20: 42.4000,
  k21: 76.0000,
  k22: 9.9000,
  k23: 43.5000,
  k24: 77.1000,
  k25: 11.0000,
  k26: 44.6000,
  k27: 78.2000,
  k28: 12.1000,
  k29: 45.7000,
  k30: 79.3000,
  k31: 13.2000,
  k32: 46.8000,
  k33: 80.4000,
  k34: 14.3000,
  k35: 47.9000,
  k36: 81.5000,
  k37: 15.4000,
  k38: 49.0000,
  k39: 82.6000,
  k40: 16.5000,
  k41: 50.1000,
  k42: 83.7000,
  k43: 17.6000,
  k44: 51.2000,
  k45: 84.8000,
  k46: 18.7000,
  k47: 52.3000,
  k48: 85.9000,
  k49: 19.8000,
  k50: 53.4000,
  k51: 87.0000,
  k52: 20.9000,
  k53: 54.5000,
  k54: 88.1000,
  k55: 22.0000,
  k56: 55.6000,
  k57: 89.2000,
  k58: 23.1000,
  k59: 56.7000,
  k60: 90.3000,
  k61: 24.2000,
  k62: 57.8000,
  k63: 91.4000,
  k64: 25.3000,
  k65: 58.9000,
  k66: 92.5000,
  k67: 26.4000,
  k68: 60.0000,
  k69: 93.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_115_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_115_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_115_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_115_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_115_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_115_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_115_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_115_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_115_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_115_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_115_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
