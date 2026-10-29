import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 031 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_031_META = {
  id: 'mig_031',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 30750,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_031_COEF = {
  k0: 21.2000,
  k1: 5.5000,
  k2: 89.5000,
  k3: 73.8000,
  k4: 58.1000,
  k5: 42.4000,
  k6: 26.7000,
  k7: 11.0000,
  k8: 95.0000,
  k9: 79.3000,
  k10: 63.6000,
  k11: 47.9000,
  k12: 32.2000,
  k13: 16.5000,
  k14: 0.8000,
  k15: 84.8000,
  k16: 69.1000,
  k17: 53.4000,
  k18: 37.7000,
  k19: 22.0000,
  k20: 6.3000,
  k21: 90.3000,
  k22: 74.6000,
  k23: 58.9000,
  k24: 43.2000,
  k25: 27.5000,
  k26: 11.8000,
  k27: 95.8000,
  k28: 80.1000,
  k29: 64.4000,
  k30: 48.7000,
  k31: 33.0000,
  k32: 17.3000,
  k33: 1.6000,
  k34: 85.6000,
  k35: 69.9000,
  k36: 54.2000,
  k37: 38.5000,
  k38: 22.8000,
  k39: 7.1000,
  k40: 91.1000,
  k41: 75.4000,
  k42: 59.7000,
  k43: 44.0000,
  k44: 28.3000,
  k45: 12.6000,
  k46: 96.6000,
  k47: 80.9000,
  k48: 65.2000,
  k49: 49.5000,
  k50: 33.8000,
  k51: 18.1000,
  k52: 2.4000,
  k53: 86.4000,
  k54: 70.7000,
  k55: 55.0000,
  k56: 39.3000,
  k57: 23.6000,
  k58: 7.9000,
  k59: 91.9000,
  k60: 76.2000,
  k61: 60.5000,
  k62: 44.8000,
  k63: 29.1000,
  k64: 13.4000,
  k65: 97.4000,
  k66: 81.7000,
  k67: 66.0000,
  k68: 50.3000,
  k69: 34.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_031_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_031_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_031_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_031_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_031_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_031_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_031_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_031_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_031_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_031_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_031_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
