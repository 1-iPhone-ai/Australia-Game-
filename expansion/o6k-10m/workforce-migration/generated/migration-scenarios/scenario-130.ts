import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 130 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_130_META = {
  id: 'mig_130',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 128859,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_130_COEF = {
  k0: 23.3000,
  k1: 47.9000,
  k2: 72.5000,
  k3: 97.1000,
  k4: 22.0000,
  k5: 46.6000,
  k6: 71.2000,
  k7: 95.8000,
  k8: 20.7000,
  k9: 45.3000,
  k10: 69.9000,
  k11: 94.5000,
  k12: 19.4000,
  k13: 44.0000,
  k14: 68.6000,
  k15: 93.2000,
  k16: 18.1000,
  k17: 42.7000,
  k18: 67.3000,
  k19: 91.9000,
  k20: 16.8000,
  k21: 41.4000,
  k22: 66.0000,
  k23: 90.6000,
  k24: 15.5000,
  k25: 40.1000,
  k26: 64.7000,
  k27: 89.3000,
  k28: 14.2000,
  k29: 38.8000,
  k30: 63.4000,
  k31: 88.0000,
  k32: 12.9000,
  k33: 37.5000,
  k34: 62.1000,
  k35: 86.7000,
  k36: 11.6000,
  k37: 36.2000,
  k38: 60.8000,
  k39: 85.4000,
  k40: 10.3000,
  k41: 34.9000,
  k42: 59.5000,
  k43: 84.1000,
  k44: 9.0000,
  k45: 33.6000,
  k46: 58.2000,
  k47: 82.8000,
  k48: 7.7000,
  k49: 32.3000,
  k50: 56.9000,
  k51: 81.5000,
  k52: 6.4000,
  k53: 31.0000,
  k54: 55.6000,
  k55: 80.2000,
  k56: 5.1000,
  k57: 29.7000,
  k58: 54.3000,
  k59: 78.9000,
  k60: 3.8000,
  k61: 28.4000,
  k62: 53.0000,
  k63: 77.6000,
  k64: 2.5000,
  k65: 27.1000,
  k66: 51.7000,
  k67: 76.3000,
  k68: 1.2000,
  k69: 25.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_130_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_130_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_130_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_130_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_130_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_130_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_130_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_130_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_130_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_130_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_130_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
