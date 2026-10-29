import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 029 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_029_META = {
  id: 'mig_029',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 28768,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_029_COEF = {
  k0: 27.2000,
  k1: 12.7000,
  k2: 97.9000,
  k3: 83.4000,
  k4: 68.9000,
  k5: 54.4000,
  k6: 39.9000,
  k7: 25.4000,
  k8: 10.9000,
  k9: 96.1000,
  k10: 81.6000,
  k11: 67.1000,
  k12: 52.6000,
  k13: 38.1000,
  k14: 23.6000,
  k15: 9.1000,
  k16: 94.3000,
  k17: 79.8000,
  k18: 65.3000,
  k19: 50.8000,
  k20: 36.3000,
  k21: 21.8000,
  k22: 7.3000,
  k23: 92.5000,
  k24: 78.0000,
  k25: 63.5000,
  k26: 49.0000,
  k27: 34.5000,
  k28: 20.0000,
  k29: 5.5000,
  k30: 90.7000,
  k31: 76.2000,
  k32: 61.7000,
  k33: 47.2000,
  k34: 32.7000,
  k35: 18.2000,
  k36: 3.7000,
  k37: 88.9000,
  k38: 74.4000,
  k39: 59.9000,
  k40: 45.4000,
  k41: 30.9000,
  k42: 16.4000,
  k43: 1.9000,
  k44: 87.1000,
  k45: 72.6000,
  k46: 58.1000,
  k47: 43.6000,
  k48: 29.1000,
  k49: 14.6000,
  k50: 0.1000,
  k51: 85.3000,
  k52: 70.8000,
  k53: 56.3000,
  k54: 41.8000,
  k55: 27.3000,
  k56: 12.8000,
  k57: 98.0000,
  k58: 83.5000,
  k59: 69.0000,
  k60: 54.5000,
  k61: 40.0000,
  k62: 25.5000,
  k63: 11.0000,
  k64: 96.2000,
  k65: 81.7000,
  k66: 67.2000,
  k67: 52.7000,
  k68: 38.2000,
  k69: 23.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_029_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_029_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_029_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_029_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_029_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_029_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_029_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_029_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_029_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_029_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_029_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
