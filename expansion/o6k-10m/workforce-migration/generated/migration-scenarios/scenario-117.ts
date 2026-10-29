import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 117 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_117_META = {
  id: 'mig_117',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 115976,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_117_COEF = {
  k0: 62.3000,
  k1: 94.7000,
  k2: 27.4000,
  k3: 59.8000,
  k4: 92.2000,
  k5: 24.9000,
  k6: 57.3000,
  k7: 89.7000,
  k8: 22.4000,
  k9: 54.8000,
  k10: 87.2000,
  k11: 19.9000,
  k12: 52.3000,
  k13: 84.7000,
  k14: 17.4000,
  k15: 49.8000,
  k16: 82.2000,
  k17: 14.9000,
  k18: 47.3000,
  k19: 79.7000,
  k20: 12.4000,
  k21: 44.8000,
  k22: 77.2000,
  k23: 9.9000,
  k24: 42.3000,
  k25: 74.7000,
  k26: 7.4000,
  k27: 39.8000,
  k28: 72.2000,
  k29: 4.9000,
  k30: 37.3000,
  k31: 69.7000,
  k32: 2.4000,
  k33: 34.8000,
  k34: 67.2000,
  k35: 99.6000,
  k36: 32.3000,
  k37: 64.7000,
  k38: 97.1000,
  k39: 29.8000,
  k40: 62.2000,
  k41: 94.6000,
  k42: 27.3000,
  k43: 59.7000,
  k44: 92.1000,
  k45: 24.8000,
  k46: 57.2000,
  k47: 89.6000,
  k48: 22.3000,
  k49: 54.7000,
  k50: 87.1000,
  k51: 19.8000,
  k52: 52.2000,
  k53: 84.6000,
  k54: 17.3000,
  k55: 49.7000,
  k56: 82.1000,
  k57: 14.8000,
  k58: 47.2000,
  k59: 79.6000,
  k60: 12.3000,
  k61: 44.7000,
  k62: 77.1000,
  k63: 9.8000,
  k64: 42.2000,
  k65: 74.6000,
  k66: 7.3000,
  k67: 39.7000,
  k68: 72.1000,
  k69: 4.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_117_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_117_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_117_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_117_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_117_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_117_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_117_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_117_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_117_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_117_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_117_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
