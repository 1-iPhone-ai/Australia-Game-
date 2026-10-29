import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 030 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_030_META = {
  id: 'mig_030',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 29759,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_030_COEF = {
  k0: 24.2000,
  k1: 9.1000,
  k2: 93.7000,
  k3: 78.6000,
  k4: 63.5000,
  k5: 48.4000,
  k6: 33.3000,
  k7: 18.2000,
  k8: 3.1000,
  k9: 87.7000,
  k10: 72.6000,
  k11: 57.5000,
  k12: 42.4000,
  k13: 27.3000,
  k14: 12.2000,
  k15: 96.8000,
  k16: 81.7000,
  k17: 66.6000,
  k18: 51.5000,
  k19: 36.4000,
  k20: 21.3000,
  k21: 6.2000,
  k22: 90.8000,
  k23: 75.7000,
  k24: 60.6000,
  k25: 45.5000,
  k26: 30.4000,
  k27: 15.3000,
  k28: 0.2000,
  k29: 84.8000,
  k30: 69.7000,
  k31: 54.6000,
  k32: 39.5000,
  k33: 24.4000,
  k34: 9.3000,
  k35: 93.9000,
  k36: 78.8000,
  k37: 63.7000,
  k38: 48.6000,
  k39: 33.5000,
  k40: 18.4000,
  k41: 3.3000,
  k42: 87.9000,
  k43: 72.8000,
  k44: 57.7000,
  k45: 42.6000,
  k46: 27.5000,
  k47: 12.4000,
  k48: 97.0000,
  k49: 81.9000,
  k50: 66.8000,
  k51: 51.7000,
  k52: 36.6000,
  k53: 21.5000,
  k54: 6.4000,
  k55: 91.0000,
  k56: 75.9000,
  k57: 60.8000,
  k58: 45.7000,
  k59: 30.6000,
  k60: 15.5000,
  k61: 0.4000,
  k62: 85.0000,
  k63: 69.9000,
  k64: 54.8000,
  k65: 39.7000,
  k66: 24.6000,
  k67: 9.5000,
  k68: 94.1000,
  k69: 79.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_030_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_030_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_030_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_030_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_030_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_030_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_030_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_030_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_030_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_030_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
