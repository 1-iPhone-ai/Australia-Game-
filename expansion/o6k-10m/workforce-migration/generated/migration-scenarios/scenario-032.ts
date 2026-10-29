import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 032 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_032_META = {
  id: 'mig_032',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 31741,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_032_COEF = {
  k0: 18.2000,
  k1: 1.9000,
  k2: 85.3000,
  k3: 69.0000,
  k4: 52.7000,
  k5: 36.4000,
  k6: 20.1000,
  k7: 3.8000,
  k8: 87.2000,
  k9: 70.9000,
  k10: 54.6000,
  k11: 38.3000,
  k12: 22.0000,
  k13: 5.7000,
  k14: 89.1000,
  k15: 72.8000,
  k16: 56.5000,
  k17: 40.2000,
  k18: 23.9000,
  k19: 7.6000,
  k20: 91.0000,
  k21: 74.7000,
  k22: 58.4000,
  k23: 42.1000,
  k24: 25.8000,
  k25: 9.5000,
  k26: 92.9000,
  k27: 76.6000,
  k28: 60.3000,
  k29: 44.0000,
  k30: 27.7000,
  k31: 11.4000,
  k32: 94.8000,
  k33: 78.5000,
  k34: 62.2000,
  k35: 45.9000,
  k36: 29.6000,
  k37: 13.3000,
  k38: 96.7000,
  k39: 80.4000,
  k40: 64.1000,
  k41: 47.8000,
  k42: 31.5000,
  k43: 15.2000,
  k44: 98.6000,
  k45: 82.3000,
  k46: 66.0000,
  k47: 49.7000,
  k48: 33.4000,
  k49: 17.1000,
  k50: 0.8000,
  k51: 84.2000,
  k52: 67.9000,
  k53: 51.6000,
  k54: 35.3000,
  k55: 19.0000,
  k56: 2.7000,
  k57: 86.1000,
  k58: 69.8000,
  k59: 53.5000,
  k60: 37.2000,
  k61: 20.9000,
  k62: 4.6000,
  k63: 88.0000,
  k64: 71.7000,
  k65: 55.4000,
  k66: 39.1000,
  k67: 22.8000,
  k68: 6.5000,
  k69: 89.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_032_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_032_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_032_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_032_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_032_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_032_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_032_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_032_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_032_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_032_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_032_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
