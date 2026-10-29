import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 080 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_080_META = {
  id: 'mig_080',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 79309,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_080_COEF = {
  k0: 73.6000,
  k1: 28.5000,
  k2: 83.1000,
  k3: 38.0000,
  k4: 92.6000,
  k5: 47.5000,
  k6: 2.4000,
  k7: 57.0000,
  k8: 11.9000,
  k9: 66.5000,
  k10: 21.4000,
  k11: 76.0000,
  k12: 30.9000,
  k13: 85.5000,
  k14: 40.4000,
  k15: 95.0000,
  k16: 49.9000,
  k17: 4.8000,
  k18: 59.4000,
  k19: 14.3000,
  k20: 68.9000,
  k21: 23.8000,
  k22: 78.4000,
  k23: 33.3000,
  k24: 87.9000,
  k25: 42.8000,
  k26: 97.4000,
  k27: 52.3000,
  k28: 7.2000,
  k29: 61.8000,
  k30: 16.7000,
  k31: 71.3000,
  k32: 26.2000,
  k33: 80.8000,
  k34: 35.7000,
  k35: 90.3000,
  k36: 45.2000,
  k37: 0.1000,
  k38: 54.7000,
  k39: 9.6000,
  k40: 64.2000,
  k41: 19.1000,
  k42: 73.7000,
  k43: 28.6000,
  k44: 83.2000,
  k45: 38.1000,
  k46: 92.7000,
  k47: 47.6000,
  k48: 2.5000,
  k49: 57.1000,
  k50: 12.0000,
  k51: 66.6000,
  k52: 21.5000,
  k53: 76.1000,
  k54: 31.0000,
  k55: 85.6000,
  k56: 40.5000,
  k57: 95.1000,
  k58: 50.0000,
  k59: 4.9000,
  k60: 59.5000,
  k61: 14.4000,
  k62: 69.0000,
  k63: 23.9000,
  k64: 78.5000,
  k65: 33.4000,
  k66: 88.0000,
  k67: 42.9000,
  k68: 97.5000,
  k69: 52.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_080_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_080_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_080_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_080_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_080_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_080_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_080_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_080_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_080_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_080_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_080_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
