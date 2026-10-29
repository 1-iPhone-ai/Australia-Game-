import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 014 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_014_META = {
  id: 'mig_014',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 13903,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_014_COEF = {
  k0: 72.2000,
  k1: 66.7000,
  k2: 61.2000,
  k3: 55.7000,
  k4: 50.2000,
  k5: 44.7000,
  k6: 39.2000,
  k7: 33.7000,
  k8: 28.2000,
  k9: 22.7000,
  k10: 17.2000,
  k11: 11.7000,
  k12: 6.2000,
  k13: 0.7000,
  k14: 94.9000,
  k15: 89.4000,
  k16: 83.9000,
  k17: 78.4000,
  k18: 72.9000,
  k19: 67.4000,
  k20: 61.9000,
  k21: 56.4000,
  k22: 50.9000,
  k23: 45.4000,
  k24: 39.9000,
  k25: 34.4000,
  k26: 28.9000,
  k27: 23.4000,
  k28: 17.9000,
  k29: 12.4000,
  k30: 6.9000,
  k31: 1.4000,
  k32: 95.6000,
  k33: 90.1000,
  k34: 84.6000,
  k35: 79.1000,
  k36: 73.6000,
  k37: 68.1000,
  k38: 62.6000,
  k39: 57.1000,
  k40: 51.6000,
  k41: 46.1000,
  k42: 40.6000,
  k43: 35.1000,
  k44: 29.6000,
  k45: 24.1000,
  k46: 18.6000,
  k47: 13.1000,
  k48: 7.6000,
  k49: 2.1000,
  k50: 96.3000,
  k51: 90.8000,
  k52: 85.3000,
  k53: 79.8000,
  k54: 74.3000,
  k55: 68.8000,
  k56: 63.3000,
  k57: 57.8000,
  k58: 52.3000,
  k59: 46.8000,
  k60: 41.3000,
  k61: 35.8000,
  k62: 30.3000,
  k63: 24.8000,
  k64: 19.3000,
  k65: 13.8000,
  k66: 8.3000,
  k67: 2.8000,
  k68: 97.0000,
  k69: 91.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_014_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_014_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_014_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_014_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_014_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_014_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_014_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_014_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_014_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_014_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_014_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
