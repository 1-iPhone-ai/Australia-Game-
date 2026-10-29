import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 004 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_004_META = {
  id: 'mig_004',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 3993,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_004_COEF = {
  k0: 2.5000,
  k1: 3.0000,
  k2: 3.5000,
  k3: 4.0000,
  k4: 4.5000,
  k5: 5.0000,
  k6: 5.5000,
  k7: 6.0000,
  k8: 6.5000,
  k9: 7.0000,
  k10: 7.5000,
  k11: 8.0000,
  k12: 8.5000,
  k13: 9.0000,
  k14: 9.5000,
  k15: 10.0000,
  k16: 10.5000,
  k17: 11.0000,
  k18: 11.5000,
  k19: 12.0000,
  k20: 12.5000,
  k21: 13.0000,
  k22: 13.5000,
  k23: 14.0000,
  k24: 14.5000,
  k25: 15.0000,
  k26: 15.5000,
  k27: 16.0000,
  k28: 16.5000,
  k29: 17.0000,
  k30: 17.5000,
  k31: 18.0000,
  k32: 18.5000,
  k33: 19.0000,
  k34: 19.5000,
  k35: 20.0000,
  k36: 20.5000,
  k37: 21.0000,
  k38: 21.5000,
  k39: 22.0000,
  k40: 22.5000,
  k41: 23.0000,
  k42: 23.5000,
  k43: 24.0000,
  k44: 24.5000,
  k45: 25.0000,
  k46: 25.5000,
  k47: 26.0000,
  k48: 26.5000,
  k49: 27.0000,
  k50: 27.5000,
  k51: 28.0000,
  k52: 28.5000,
  k53: 29.0000,
  k54: 29.5000,
  k55: 30.0000,
  k56: 30.5000,
  k57: 31.0000,
  k58: 31.5000,
  k59: 32.0000,
  k60: 32.5000,
  k61: 33.0000,
  k62: 33.5000,
  k63: 34.0000,
  k64: 34.5000,
  k65: 35.0000,
  k66: 35.5000,
  k67: 36.0000,
  k68: 36.5000,
  k69: 37.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_004_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_004_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_004_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_004_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_004_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_004_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_004_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_004_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_004_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_004_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_004_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
