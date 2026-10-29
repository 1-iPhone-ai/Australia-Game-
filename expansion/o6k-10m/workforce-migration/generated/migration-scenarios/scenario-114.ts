import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 114 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_114_META = {
  id: 'mig_114',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 113003,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_114_COEF = {
  k0: 71.3000,
  k1: 5.8000,
  k2: 40.0000,
  k3: 74.2000,
  k4: 8.7000,
  k5: 42.9000,
  k6: 77.1000,
  k7: 11.6000,
  k8: 45.8000,
  k9: 80.0000,
  k10: 14.5000,
  k11: 48.7000,
  k12: 82.9000,
  k13: 17.4000,
  k14: 51.6000,
  k15: 85.8000,
  k16: 20.3000,
  k17: 54.5000,
  k18: 88.7000,
  k19: 23.2000,
  k20: 57.4000,
  k21: 91.6000,
  k22: 26.1000,
  k23: 60.3000,
  k24: 94.5000,
  k25: 29.0000,
  k26: 63.2000,
  k27: 97.4000,
  k28: 31.9000,
  k29: 66.1000,
  k30: 0.6000,
  k31: 34.8000,
  k32: 69.0000,
  k33: 3.5000,
  k34: 37.7000,
  k35: 71.9000,
  k36: 6.4000,
  k37: 40.6000,
  k38: 74.8000,
  k39: 9.3000,
  k40: 43.5000,
  k41: 77.7000,
  k42: 12.2000,
  k43: 46.4000,
  k44: 80.6000,
  k45: 15.1000,
  k46: 49.3000,
  k47: 83.5000,
  k48: 18.0000,
  k49: 52.2000,
  k50: 86.4000,
  k51: 20.9000,
  k52: 55.1000,
  k53: 89.3000,
  k54: 23.8000,
  k55: 58.0000,
  k56: 92.2000,
  k57: 26.7000,
  k58: 60.9000,
  k59: 95.1000,
  k60: 29.6000,
  k61: 63.8000,
  k62: 98.0000,
  k63: 32.5000,
  k64: 66.7000,
  k65: 1.2000,
  k66: 35.4000,
  k67: 69.6000,
  k68: 4.1000,
  k69: 38.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_114_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_114_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_114_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_114_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_114_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_114_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_114_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_114_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_114_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_114_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_114_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
