import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 123 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_123_META = {
  id: 'mig_123',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 121922,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_123_COEF = {
  k0: 44.3000,
  k1: 73.1000,
  k2: 2.2000,
  k3: 31.0000,
  k4: 59.8000,
  k5: 88.6000,
  k6: 17.7000,
  k7: 46.5000,
  k8: 75.3000,
  k9: 4.4000,
  k10: 33.2000,
  k11: 62.0000,
  k12: 90.8000,
  k13: 19.9000,
  k14: 48.7000,
  k15: 77.5000,
  k16: 6.6000,
  k17: 35.4000,
  k18: 64.2000,
  k19: 93.0000,
  k20: 22.1000,
  k21: 50.9000,
  k22: 79.7000,
  k23: 8.8000,
  k24: 37.6000,
  k25: 66.4000,
  k26: 95.2000,
  k27: 24.3000,
  k28: 53.1000,
  k29: 81.9000,
  k30: 11.0000,
  k31: 39.8000,
  k32: 68.6000,
  k33: 97.4000,
  k34: 26.5000,
  k35: 55.3000,
  k36: 84.1000,
  k37: 13.2000,
  k38: 42.0000,
  k39: 70.8000,
  k40: 99.6000,
  k41: 28.7000,
  k42: 57.5000,
  k43: 86.3000,
  k44: 15.4000,
  k45: 44.2000,
  k46: 73.0000,
  k47: 2.1000,
  k48: 30.9000,
  k49: 59.7000,
  k50: 88.5000,
  k51: 17.6000,
  k52: 46.4000,
  k53: 75.2000,
  k54: 4.3000,
  k55: 33.1000,
  k56: 61.9000,
  k57: 90.7000,
  k58: 19.8000,
  k59: 48.6000,
  k60: 77.4000,
  k61: 6.5000,
  k62: 35.3000,
  k63: 64.1000,
  k64: 92.9000,
  k65: 22.0000,
  k66: 50.8000,
  k67: 79.6000,
  k68: 8.7000,
  k69: 37.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_123_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_123_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_123_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_123_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_123_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_123_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_123_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_123_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_123_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_123_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_123_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
