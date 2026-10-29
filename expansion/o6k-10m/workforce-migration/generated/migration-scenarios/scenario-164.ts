import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 164 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_164_META = {
  id: 'mig_164',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 162553,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_164_COEF = {
  k0: 21.0000,
  k1: 25.2000,
  k2: 29.4000,
  k3: 33.6000,
  k4: 37.8000,
  k5: 42.0000,
  k6: 46.2000,
  k7: 50.4000,
  k8: 54.6000,
  k9: 58.8000,
  k10: 63.0000,
  k11: 67.2000,
  k12: 71.4000,
  k13: 75.6000,
  k14: 79.8000,
  k15: 84.0000,
  k16: 88.2000,
  k17: 92.4000,
  k18: 96.6000,
  k19: 1.1000,
  k20: 5.3000,
  k21: 9.5000,
  k22: 13.7000,
  k23: 17.9000,
  k24: 22.1000,
  k25: 26.3000,
  k26: 30.5000,
  k27: 34.7000,
  k28: 38.9000,
  k29: 43.1000,
  k30: 47.3000,
  k31: 51.5000,
  k32: 55.7000,
  k33: 59.9000,
  k34: 64.1000,
  k35: 68.3000,
  k36: 72.5000,
  k37: 76.7000,
  k38: 80.9000,
  k39: 85.1000,
  k40: 89.3000,
  k41: 93.5000,
  k42: 97.7000,
  k43: 2.2000,
  k44: 6.4000,
  k45: 10.6000,
  k46: 14.8000,
  k47: 19.0000,
  k48: 23.2000,
  k49: 27.4000,
  k50: 31.6000,
  k51: 35.8000,
  k52: 40.0000,
  k53: 44.2000,
  k54: 48.4000,
  k55: 52.6000,
  k56: 56.8000,
  k57: 61.0000,
  k58: 65.2000,
  k59: 69.4000,
  k60: 73.6000,
  k61: 77.8000,
  k62: 82.0000,
  k63: 86.2000,
  k64: 90.4000,
  k65: 94.6000,
  k66: 98.8000,
  k67: 3.3000,
  k68: 7.5000,
  k69: 11.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_164_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_164_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_164_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_164_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_164_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_164_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_164_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_164_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_164_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_164_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_164_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
