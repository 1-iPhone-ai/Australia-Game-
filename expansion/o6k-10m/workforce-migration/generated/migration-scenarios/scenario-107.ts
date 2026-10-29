import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 107 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_107_META = {
  id: 'mig_107',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 106066,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_107_COEF = {
  k0: 92.3000,
  k1: 31.0000,
  k2: 69.4000,
  k3: 8.1000,
  k4: 46.5000,
  k5: 84.9000,
  k6: 23.6000,
  k7: 62.0000,
  k8: 0.7000,
  k9: 39.1000,
  k10: 77.5000,
  k11: 16.2000,
  k12: 54.6000,
  k13: 93.0000,
  k14: 31.7000,
  k15: 70.1000,
  k16: 8.8000,
  k17: 47.2000,
  k18: 85.6000,
  k19: 24.3000,
  k20: 62.7000,
  k21: 1.4000,
  k22: 39.8000,
  k23: 78.2000,
  k24: 16.9000,
  k25: 55.3000,
  k26: 93.7000,
  k27: 32.4000,
  k28: 70.8000,
  k29: 9.5000,
  k30: 47.9000,
  k31: 86.3000,
  k32: 25.0000,
  k33: 63.4000,
  k34: 2.1000,
  k35: 40.5000,
  k36: 78.9000,
  k37: 17.6000,
  k38: 56.0000,
  k39: 94.4000,
  k40: 33.1000,
  k41: 71.5000,
  k42: 10.2000,
  k43: 48.6000,
  k44: 87.0000,
  k45: 25.7000,
  k46: 64.1000,
  k47: 2.8000,
  k48: 41.2000,
  k49: 79.6000,
  k50: 18.3000,
  k51: 56.7000,
  k52: 95.1000,
  k53: 33.8000,
  k54: 72.2000,
  k55: 10.9000,
  k56: 49.3000,
  k57: 87.7000,
  k58: 26.4000,
  k59: 64.8000,
  k60: 3.5000,
  k61: 41.9000,
  k62: 80.3000,
  k63: 19.0000,
  k64: 57.4000,
  k65: 95.8000,
  k66: 34.5000,
  k67: 72.9000,
  k68: 11.6000,
  k69: 50.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_107_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_107_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_107_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_107_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_107_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_107_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_107_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_107_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_107_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_107_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_107_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
