import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 161 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_161_META = {
  id: 'mig_161',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 159580,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_161_COEF = {
  k0: 30.0000,
  k1: 36.0000,
  k2: 42.0000,
  k3: 48.0000,
  k4: 54.0000,
  k5: 60.0000,
  k6: 66.0000,
  k7: 72.0000,
  k8: 78.0000,
  k9: 84.0000,
  k10: 90.0000,
  k11: 96.0000,
  k12: 2.3000,
  k13: 8.3000,
  k14: 14.3000,
  k15: 20.3000,
  k16: 26.3000,
  k17: 32.3000,
  k18: 38.3000,
  k19: 44.3000,
  k20: 50.3000,
  k21: 56.3000,
  k22: 62.3000,
  k23: 68.3000,
  k24: 74.3000,
  k25: 80.3000,
  k26: 86.3000,
  k27: 92.3000,
  k28: 98.3000,
  k29: 4.6000,
  k30: 10.6000,
  k31: 16.6000,
  k32: 22.6000,
  k33: 28.6000,
  k34: 34.6000,
  k35: 40.6000,
  k36: 46.6000,
  k37: 52.6000,
  k38: 58.6000,
  k39: 64.6000,
  k40: 70.6000,
  k41: 76.6000,
  k42: 82.6000,
  k43: 88.6000,
  k44: 94.6000,
  k45: 0.9000,
  k46: 6.9000,
  k47: 12.9000,
  k48: 18.9000,
  k49: 24.9000,
  k50: 30.9000,
  k51: 36.9000,
  k52: 42.9000,
  k53: 48.9000,
  k54: 54.9000,
  k55: 60.9000,
  k56: 66.9000,
  k57: 72.9000,
  k58: 78.9000,
  k59: 84.9000,
  k60: 90.9000,
  k61: 96.9000,
  k62: 3.2000,
  k63: 9.2000,
  k64: 15.2000,
  k65: 21.2000,
  k66: 27.2000,
  k67: 33.2000,
  k68: 39.2000,
  k69: 45.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_161_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_161_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_161_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_161_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_161_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_161_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_161_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_161_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_161_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_161_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_161_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
