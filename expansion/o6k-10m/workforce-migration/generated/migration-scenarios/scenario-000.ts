import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 000 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_000_META = {
  id: 'mig_000',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 29,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_000_COEF = {
  k0: 14.5000,
  k1: 17.4000,
  k2: 20.3000,
  k3: 23.2000,
  k4: 26.1000,
  k5: 29.0000,
  k6: 31.9000,
  k7: 34.8000,
  k8: 37.7000,
  k9: 40.6000,
  k10: 43.5000,
  k11: 46.4000,
  k12: 49.3000,
  k13: 52.2000,
  k14: 55.1000,
  k15: 58.0000,
  k16: 60.9000,
  k17: 63.8000,
  k18: 66.7000,
  k19: 69.6000,
  k20: 72.5000,
  k21: 75.4000,
  k22: 78.3000,
  k23: 81.2000,
  k24: 84.1000,
  k25: 87.0000,
  k26: 89.9000,
  k27: 92.8000,
  k28: 95.7000,
  k29: 98.6000,
  k30: 1.8000,
  k31: 4.7000,
  k32: 7.6000,
  k33: 10.5000,
  k34: 13.4000,
  k35: 16.3000,
  k36: 19.2000,
  k37: 22.1000,
  k38: 25.0000,
  k39: 27.9000,
  k40: 30.8000,
  k41: 33.7000,
  k42: 36.6000,
  k43: 39.5000,
  k44: 42.4000,
  k45: 45.3000,
  k46: 48.2000,
  k47: 51.1000,
  k48: 54.0000,
  k49: 56.9000,
  k50: 59.8000,
  k51: 62.7000,
  k52: 65.6000,
  k53: 68.5000,
  k54: 71.4000,
  k55: 74.3000,
  k56: 77.2000,
  k57: 80.1000,
  k58: 83.0000,
  k59: 85.9000,
  k60: 88.8000,
  k61: 91.7000,
  k62: 94.6000,
  k63: 97.5000,
  k64: 0.7000,
  k65: 3.6000,
  k66: 6.5000,
  k67: 9.4000,
  k68: 12.3000,
  k69: 15.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_000_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_000_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_000_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_000_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_000_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_000_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_000_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_000_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_000_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_000_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_000_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
