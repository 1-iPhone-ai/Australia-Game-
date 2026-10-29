import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 126 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_126_META = {
  id: 'mig_126',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 124895,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_126_COEF = {
  k0: 35.3000,
  k1: 62.3000,
  k2: 89.3000,
  k3: 16.6000,
  k4: 43.6000,
  k5: 70.6000,
  k6: 97.6000,
  k7: 24.9000,
  k8: 51.9000,
  k9: 78.9000,
  k10: 6.2000,
  k11: 33.2000,
  k12: 60.2000,
  k13: 87.2000,
  k14: 14.5000,
  k15: 41.5000,
  k16: 68.5000,
  k17: 95.5000,
  k18: 22.8000,
  k19: 49.8000,
  k20: 76.8000,
  k21: 4.1000,
  k22: 31.1000,
  k23: 58.1000,
  k24: 85.1000,
  k25: 12.4000,
  k26: 39.4000,
  k27: 66.4000,
  k28: 93.4000,
  k29: 20.7000,
  k30: 47.7000,
  k31: 74.7000,
  k32: 2.0000,
  k33: 29.0000,
  k34: 56.0000,
  k35: 83.0000,
  k36: 10.3000,
  k37: 37.3000,
  k38: 64.3000,
  k39: 91.3000,
  k40: 18.6000,
  k41: 45.6000,
  k42: 72.6000,
  k43: 99.6000,
  k44: 26.9000,
  k45: 53.9000,
  k46: 80.9000,
  k47: 8.2000,
  k48: 35.2000,
  k49: 62.2000,
  k50: 89.2000,
  k51: 16.5000,
  k52: 43.5000,
  k53: 70.5000,
  k54: 97.5000,
  k55: 24.8000,
  k56: 51.8000,
  k57: 78.8000,
  k58: 6.1000,
  k59: 33.1000,
  k60: 60.1000,
  k61: 87.1000,
  k62: 14.4000,
  k63: 41.4000,
  k64: 68.4000,
  k65: 95.4000,
  k66: 22.7000,
  k67: 49.7000,
  k68: 76.7000,
  k69: 4.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_126_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_126_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_126_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_126_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_126_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_126_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_126_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_126_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_126_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_126_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_126_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
