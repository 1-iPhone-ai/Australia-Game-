import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 017 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_017_META = {
  id: 'mig_017',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 16876,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_017_COEF = {
  k0: 63.2000,
  k1: 55.9000,
  k2: 48.6000,
  k3: 41.3000,
  k4: 34.0000,
  k5: 26.7000,
  k6: 19.4000,
  k7: 12.1000,
  k8: 4.8000,
  k9: 97.2000,
  k10: 89.9000,
  k11: 82.6000,
  k12: 75.3000,
  k13: 68.0000,
  k14: 60.7000,
  k15: 53.4000,
  k16: 46.1000,
  k17: 38.8000,
  k18: 31.5000,
  k19: 24.2000,
  k20: 16.9000,
  k21: 9.6000,
  k22: 2.3000,
  k23: 94.7000,
  k24: 87.4000,
  k25: 80.1000,
  k26: 72.8000,
  k27: 65.5000,
  k28: 58.2000,
  k29: 50.9000,
  k30: 43.6000,
  k31: 36.3000,
  k32: 29.0000,
  k33: 21.7000,
  k34: 14.4000,
  k35: 7.1000,
  k36: 99.5000,
  k37: 92.2000,
  k38: 84.9000,
  k39: 77.6000,
  k40: 70.3000,
  k41: 63.0000,
  k42: 55.7000,
  k43: 48.4000,
  k44: 41.1000,
  k45: 33.8000,
  k46: 26.5000,
  k47: 19.2000,
  k48: 11.9000,
  k49: 4.6000,
  k50: 97.0000,
  k51: 89.7000,
  k52: 82.4000,
  k53: 75.1000,
  k54: 67.8000,
  k55: 60.5000,
  k56: 53.2000,
  k57: 45.9000,
  k58: 38.6000,
  k59: 31.3000,
  k60: 24.0000,
  k61: 16.7000,
  k62: 9.4000,
  k63: 2.1000,
  k64: 94.5000,
  k65: 87.2000,
  k66: 79.9000,
  k67: 72.6000,
  k68: 65.3000,
  k69: 58.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_017_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_017_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_017_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_017_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_017_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_017_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_017_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_017_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_017_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_017_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_017_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
