import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 112 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_112_META = {
  id: 'mig_112',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 111021,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_112_COEF = {
  k0: 77.3000,
  k1: 13.0000,
  k2: 48.4000,
  k3: 83.8000,
  k4: 19.5000,
  k5: 54.9000,
  k6: 90.3000,
  k7: 26.0000,
  k8: 61.4000,
  k9: 96.8000,
  k10: 32.5000,
  k11: 67.9000,
  k12: 3.6000,
  k13: 39.0000,
  k14: 74.4000,
  k15: 10.1000,
  k16: 45.5000,
  k17: 80.9000,
  k18: 16.6000,
  k19: 52.0000,
  k20: 87.4000,
  k21: 23.1000,
  k22: 58.5000,
  k23: 93.9000,
  k24: 29.6000,
  k25: 65.0000,
  k26: 0.7000,
  k27: 36.1000,
  k28: 71.5000,
  k29: 7.2000,
  k30: 42.6000,
  k31: 78.0000,
  k32: 13.7000,
  k33: 49.1000,
  k34: 84.5000,
  k35: 20.2000,
  k36: 55.6000,
  k37: 91.0000,
  k38: 26.7000,
  k39: 62.1000,
  k40: 97.5000,
  k41: 33.2000,
  k42: 68.6000,
  k43: 4.3000,
  k44: 39.7000,
  k45: 75.1000,
  k46: 10.8000,
  k47: 46.2000,
  k48: 81.6000,
  k49: 17.3000,
  k50: 52.7000,
  k51: 88.1000,
  k52: 23.8000,
  k53: 59.2000,
  k54: 94.6000,
  k55: 30.3000,
  k56: 65.7000,
  k57: 1.4000,
  k58: 36.8000,
  k59: 72.2000,
  k60: 7.9000,
  k61: 43.3000,
  k62: 78.7000,
  k63: 14.4000,
  k64: 49.8000,
  k65: 85.2000,
  k66: 20.9000,
  k67: 56.3000,
  k68: 91.7000,
  k69: 27.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_112_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_112_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_112_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_112_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_112_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_112_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_112_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_112_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_112_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_112_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_112_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
