import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 073 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_073_META = {
  id: 'mig_073',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 72372,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_073_COEF = {
  k0: 94.6000,
  k1: 53.7000,
  k2: 12.8000,
  k3: 71.6000,
  k4: 30.7000,
  k5: 89.5000,
  k6: 48.6000,
  k7: 7.7000,
  k8: 66.5000,
  k9: 25.6000,
  k10: 84.4000,
  k11: 43.5000,
  k12: 2.6000,
  k13: 61.4000,
  k14: 20.5000,
  k15: 79.3000,
  k16: 38.4000,
  k17: 97.2000,
  k18: 56.3000,
  k19: 15.4000,
  k20: 74.2000,
  k21: 33.3000,
  k22: 92.1000,
  k23: 51.2000,
  k24: 10.3000,
  k25: 69.1000,
  k26: 28.2000,
  k27: 87.0000,
  k28: 46.1000,
  k29: 5.2000,
  k30: 64.0000,
  k31: 23.1000,
  k32: 81.9000,
  k33: 41.0000,
  k34: 0.1000,
  k35: 58.9000,
  k36: 18.0000,
  k37: 76.8000,
  k38: 35.9000,
  k39: 94.7000,
  k40: 53.8000,
  k41: 12.9000,
  k42: 71.7000,
  k43: 30.8000,
  k44: 89.6000,
  k45: 48.7000,
  k46: 7.8000,
  k47: 66.6000,
  k48: 25.7000,
  k49: 84.5000,
  k50: 43.6000,
  k51: 2.7000,
  k52: 61.5000,
  k53: 20.6000,
  k54: 79.4000,
  k55: 38.5000,
  k56: 97.3000,
  k57: 56.4000,
  k58: 15.5000,
  k59: 74.3000,
  k60: 33.4000,
  k61: 92.2000,
  k62: 51.3000,
  k63: 10.4000,
  k64: 69.2000,
  k65: 28.3000,
  k66: 87.1000,
  k67: 46.2000,
  k68: 5.3000,
  k69: 64.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_073_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_073_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_073_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_073_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_073_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_073_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_073_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_073_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_073_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_073_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_073_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
