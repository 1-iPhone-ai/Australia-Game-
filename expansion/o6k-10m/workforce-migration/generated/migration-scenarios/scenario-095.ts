import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 095 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_095_META = {
  id: 'mig_095',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 94174,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_095_COEF = {
  k0: 28.6000,
  k1: 74.2000,
  k2: 20.1000,
  k3: 65.7000,
  k4: 11.6000,
  k5: 57.2000,
  k6: 3.1000,
  k7: 48.7000,
  k8: 94.3000,
  k9: 40.2000,
  k10: 85.8000,
  k11: 31.7000,
  k12: 77.3000,
  k13: 23.2000,
  k14: 68.8000,
  k15: 14.7000,
  k16: 60.3000,
  k17: 6.2000,
  k18: 51.8000,
  k19: 97.4000,
  k20: 43.3000,
  k21: 88.9000,
  k22: 34.8000,
  k23: 80.4000,
  k24: 26.3000,
  k25: 71.9000,
  k26: 17.8000,
  k27: 63.4000,
  k28: 9.3000,
  k29: 54.9000,
  k30: 0.8000,
  k31: 46.4000,
  k32: 92.0000,
  k33: 37.9000,
  k34: 83.5000,
  k35: 29.4000,
  k36: 75.0000,
  k37: 20.9000,
  k38: 66.5000,
  k39: 12.4000,
  k40: 58.0000,
  k41: 3.9000,
  k42: 49.5000,
  k43: 95.1000,
  k44: 41.0000,
  k45: 86.6000,
  k46: 32.5000,
  k47: 78.1000,
  k48: 24.0000,
  k49: 69.6000,
  k50: 15.5000,
  k51: 61.1000,
  k52: 7.0000,
  k53: 52.6000,
  k54: 98.2000,
  k55: 44.1000,
  k56: 89.7000,
  k57: 35.6000,
  k58: 81.2000,
  k59: 27.1000,
  k60: 72.7000,
  k61: 18.6000,
  k62: 64.2000,
  k63: 10.1000,
  k64: 55.7000,
  k65: 1.6000,
  k66: 47.2000,
  k67: 92.8000,
  k68: 38.7000,
  k69: 84.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_095_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_095_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_095_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_095_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_095_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_095_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_095_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_095_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_095_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_095_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_095_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
