import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 142 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_142_META = {
  id: 'mig_142',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 140751,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_142_COEF = {
  k0: 87.0000,
  k1: 4.7000,
  k2: 22.1000,
  k3: 39.5000,
  k4: 56.9000,
  k5: 74.3000,
  k6: 91.7000,
  k7: 9.4000,
  k8: 26.8000,
  k9: 44.2000,
  k10: 61.6000,
  k11: 79.0000,
  k12: 96.4000,
  k13: 14.1000,
  k14: 31.5000,
  k15: 48.9000,
  k16: 66.3000,
  k17: 83.7000,
  k18: 1.4000,
  k19: 18.8000,
  k20: 36.2000,
  k21: 53.6000,
  k22: 71.0000,
  k23: 88.4000,
  k24: 6.1000,
  k25: 23.5000,
  k26: 40.9000,
  k27: 58.3000,
  k28: 75.7000,
  k29: 93.1000,
  k30: 10.8000,
  k31: 28.2000,
  k32: 45.6000,
  k33: 63.0000,
  k34: 80.4000,
  k35: 97.8000,
  k36: 15.5000,
  k37: 32.9000,
  k38: 50.3000,
  k39: 67.7000,
  k40: 85.1000,
  k41: 2.8000,
  k42: 20.2000,
  k43: 37.6000,
  k44: 55.0000,
  k45: 72.4000,
  k46: 89.8000,
  k47: 7.5000,
  k48: 24.9000,
  k49: 42.3000,
  k50: 59.7000,
  k51: 77.1000,
  k52: 94.5000,
  k53: 12.2000,
  k54: 29.6000,
  k55: 47.0000,
  k56: 64.4000,
  k57: 81.8000,
  k58: 99.2000,
  k59: 16.9000,
  k60: 34.3000,
  k61: 51.7000,
  k62: 69.1000,
  k63: 86.5000,
  k64: 4.2000,
  k65: 21.6000,
  k66: 39.0000,
  k67: 56.4000,
  k68: 73.8000,
  k69: 91.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_142_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_142_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_142_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_142_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_142_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_142_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_142_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_142_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_142_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_142_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_142_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
