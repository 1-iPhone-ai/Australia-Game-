import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 019 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_019_META = {
  id: 'mig_019',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 18858,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_019_COEF = {
  k0: 57.2000,
  k1: 48.7000,
  k2: 40.2000,
  k3: 31.7000,
  k4: 23.2000,
  k5: 14.7000,
  k6: 6.2000,
  k7: 97.4000,
  k8: 88.9000,
  k9: 80.4000,
  k10: 71.9000,
  k11: 63.4000,
  k12: 54.9000,
  k13: 46.4000,
  k14: 37.9000,
  k15: 29.4000,
  k16: 20.9000,
  k17: 12.4000,
  k18: 3.9000,
  k19: 95.1000,
  k20: 86.6000,
  k21: 78.1000,
  k22: 69.6000,
  k23: 61.1000,
  k24: 52.6000,
  k25: 44.1000,
  k26: 35.6000,
  k27: 27.1000,
  k28: 18.6000,
  k29: 10.1000,
  k30: 1.6000,
  k31: 92.8000,
  k32: 84.3000,
  k33: 75.8000,
  k34: 67.3000,
  k35: 58.8000,
  k36: 50.3000,
  k37: 41.8000,
  k38: 33.3000,
  k39: 24.8000,
  k40: 16.3000,
  k41: 7.8000,
  k42: 99.0000,
  k43: 90.5000,
  k44: 82.0000,
  k45: 73.5000,
  k46: 65.0000,
  k47: 56.5000,
  k48: 48.0000,
  k49: 39.5000,
  k50: 31.0000,
  k51: 22.5000,
  k52: 14.0000,
  k53: 5.5000,
  k54: 96.7000,
  k55: 88.2000,
  k56: 79.7000,
  k57: 71.2000,
  k58: 62.7000,
  k59: 54.2000,
  k60: 45.7000,
  k61: 37.2000,
  k62: 28.7000,
  k63: 20.2000,
  k64: 11.7000,
  k65: 3.2000,
  k66: 94.4000,
  k67: 85.9000,
  k68: 77.4000,
  k69: 68.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_019_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_019_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_019_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_019_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_019_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_019_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_019_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_019_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_019_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_019_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_019_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
