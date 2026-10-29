import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 042 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_042_META = {
  id: 'mig_042',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 41651,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_042_COEF = {
  k0: 87.9000,
  k1: 65.6000,
  k2: 43.3000,
  k3: 21.0000,
  k4: 98.4000,
  k5: 76.1000,
  k6: 53.8000,
  k7: 31.5000,
  k8: 9.2000,
  k9: 86.6000,
  k10: 64.3000,
  k11: 42.0000,
  k12: 19.7000,
  k13: 97.1000,
  k14: 74.8000,
  k15: 52.5000,
  k16: 30.2000,
  k17: 7.9000,
  k18: 85.3000,
  k19: 63.0000,
  k20: 40.7000,
  k21: 18.4000,
  k22: 95.8000,
  k23: 73.5000,
  k24: 51.2000,
  k25: 28.9000,
  k26: 6.6000,
  k27: 84.0000,
  k28: 61.7000,
  k29: 39.4000,
  k30: 17.1000,
  k31: 94.5000,
  k32: 72.2000,
  k33: 49.9000,
  k34: 27.6000,
  k35: 5.3000,
  k36: 82.7000,
  k37: 60.4000,
  k38: 38.1000,
  k39: 15.8000,
  k40: 93.2000,
  k41: 70.9000,
  k42: 48.6000,
  k43: 26.3000,
  k44: 4.0000,
  k45: 81.4000,
  k46: 59.1000,
  k47: 36.8000,
  k48: 14.5000,
  k49: 91.9000,
  k50: 69.6000,
  k51: 47.3000,
  k52: 25.0000,
  k53: 2.7000,
  k54: 80.1000,
  k55: 57.8000,
  k56: 35.5000,
  k57: 13.2000,
  k58: 90.6000,
  k59: 68.3000,
  k60: 46.0000,
  k61: 23.7000,
  k62: 1.4000,
  k63: 78.8000,
  k64: 56.5000,
  k65: 34.2000,
  k66: 11.9000,
  k67: 89.3000,
  k68: 67.0000,
  k69: 44.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_042_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_042_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_042_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_042_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_042_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_042_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_042_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_042_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_042_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_042_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_042_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
