import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 158 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_158_META = {
  id: 'mig_158',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 156607,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_158_COEF = {
  k0: 39.0000,
  k1: 46.8000,
  k2: 54.6000,
  k3: 62.4000,
  k4: 70.2000,
  k5: 78.0000,
  k6: 85.8000,
  k7: 93.6000,
  k8: 1.7000,
  k9: 9.5000,
  k10: 17.3000,
  k11: 25.1000,
  k12: 32.9000,
  k13: 40.7000,
  k14: 48.5000,
  k15: 56.3000,
  k16: 64.1000,
  k17: 71.9000,
  k18: 79.7000,
  k19: 87.5000,
  k20: 95.3000,
  k21: 3.4000,
  k22: 11.2000,
  k23: 19.0000,
  k24: 26.8000,
  k25: 34.6000,
  k26: 42.4000,
  k27: 50.2000,
  k28: 58.0000,
  k29: 65.8000,
  k30: 73.6000,
  k31: 81.4000,
  k32: 89.2000,
  k33: 97.0000,
  k34: 5.1000,
  k35: 12.9000,
  k36: 20.7000,
  k37: 28.5000,
  k38: 36.3000,
  k39: 44.1000,
  k40: 51.9000,
  k41: 59.7000,
  k42: 67.5000,
  k43: 75.3000,
  k44: 83.1000,
  k45: 90.9000,
  k46: 98.7000,
  k47: 6.8000,
  k48: 14.6000,
  k49: 22.4000,
  k50: 30.2000,
  k51: 38.0000,
  k52: 45.8000,
  k53: 53.6000,
  k54: 61.4000,
  k55: 69.2000,
  k56: 77.0000,
  k57: 84.8000,
  k58: 92.6000,
  k59: 0.7000,
  k60: 8.5000,
  k61: 16.3000,
  k62: 24.1000,
  k63: 31.9000,
  k64: 39.7000,
  k65: 47.5000,
  k66: 55.3000,
  k67: 63.1000,
  k68: 70.9000,
  k69: 78.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_158_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_158_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_158_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_158_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_158_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_158_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_158_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_158_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_158_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_158_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_158_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
