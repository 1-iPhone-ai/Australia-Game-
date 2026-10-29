import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 086 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_086_META = {
  id: 'mig_086',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 85255,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_086_COEF = {
  k0: 55.6000,
  k1: 6.9000,
  k2: 57.9000,
  k3: 9.2000,
  k4: 60.2000,
  k5: 11.5000,
  k6: 62.5000,
  k7: 13.8000,
  k8: 64.8000,
  k9: 16.1000,
  k10: 67.1000,
  k11: 18.4000,
  k12: 69.4000,
  k13: 20.7000,
  k14: 71.7000,
  k15: 23.0000,
  k16: 74.0000,
  k17: 25.3000,
  k18: 76.3000,
  k19: 27.6000,
  k20: 78.6000,
  k21: 29.9000,
  k22: 80.9000,
  k23: 32.2000,
  k24: 83.2000,
  k25: 34.5000,
  k26: 85.5000,
  k27: 36.8000,
  k28: 87.8000,
  k29: 39.1000,
  k30: 90.1000,
  k31: 41.4000,
  k32: 92.4000,
  k33: 43.7000,
  k34: 94.7000,
  k35: 46.0000,
  k36: 97.0000,
  k37: 48.3000,
  k38: 99.3000,
  k39: 50.6000,
  k40: 1.9000,
  k41: 52.9000,
  k42: 4.2000,
  k43: 55.2000,
  k44: 6.5000,
  k45: 57.5000,
  k46: 8.8000,
  k47: 59.8000,
  k48: 11.1000,
  k49: 62.1000,
  k50: 13.4000,
  k51: 64.4000,
  k52: 15.7000,
  k53: 66.7000,
  k54: 18.0000,
  k55: 69.0000,
  k56: 20.3000,
  k57: 71.3000,
  k58: 22.6000,
  k59: 73.6000,
  k60: 24.9000,
  k61: 75.9000,
  k62: 27.2000,
  k63: 78.2000,
  k64: 29.5000,
  k65: 80.5000,
  k66: 31.8000,
  k67: 82.8000,
  k68: 34.1000,
  k69: 85.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_086_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_086_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_086_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_086_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_086_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_086_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_086_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_086_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_086_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_086_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_086_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
